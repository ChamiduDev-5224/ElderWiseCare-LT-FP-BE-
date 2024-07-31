import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { Gig } from 'src/entities/gig.entity';
import { CreateGigDto } from './dto/create-gig.dto';
import { Service } from 'src/entities/service.entity';

@Injectable()
export class GigService {
  constructor(
    @InjectRepository(Gig)
    private readonly gigRepository: Repository<Gig>,

    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly dataSource: DataSource,
    @InjectEntityManager() private entityManager: EntityManager,
  ) {}

  async create(createGigDto: CreateGigDto): Promise<any> {
    const { title, description, image, userId, serviceList } = createGigDto;

    const gig = this.gigRepository.create({
      tit: title,
      des: description,
      imu: image,
      user: { uid: userId }, // Set the user object reference
      sts: 1,
    });

    try {
      const savedGig = await this.gigRepository.save(gig);

      if (savedGig) {
        // Save services related to the gig
        await Promise.all(
          serviceList.map(async (description) => {
            const service = this.serviceRepository.create({
              des: description,
              sts: 1,
              gig: savedGig, // Set the relationship
            });
            return this.serviceRepository.save(service);
          }),
        );
      }

      return {
        message: 'Gig Successfully Added.',
        sts: 1,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findOne(id: number): Promise<Gig> {
    try {
      return this.gigRepository.findOne({
        where: { gid: id },
        relations: ['services'],
      });
    } catch (error) {
      console.log(error);
      throw new Error('Error finding gig');
    }
  }

  async getGigs(
    latitude: number,
    userId: number,
    longitude: number,
  ): Promise<any> {
    try {
      // Raw SQL Query to get gigs with distance calculation
      const query = `
        SELECT 
            gig.*, 
            user.lat AS userLat, 
            user.lgt AS userLon,
            (6371 * acos(
                cos(radians(?)) * cos(radians(user.lat)) * cos(radians(user.lgt) - radians(?)) + 
                sin(radians(?)) * sin(radians(user.lat))
            )) AS distance
        FROM 
            gig 
        LEFT JOIN 
            user ON gig.uid = user.uid 
        WHERE 
            gig.sts = ? 
        ORDER BY 
            distance
      `;

      // Execute the raw SQL query
      const gigs = await this.entityManager.query(query, [
        latitude,
        longitude,
        latitude,
        1,
      ]);

      // Extract gig IDs to load related services
      const gigIds = gigs.map((gig: any) => gig.gid);

      // Fetch gigs with related services using TypeORM
      const gigsWithServices = await this.gigRepository.find({
        where: { gid: In(gigIds) },
        relations: ['services'],
      });

      // Combine distance information with gigs and their services
      const combinedResults = gigsWithServices.map((gig) => {
        const originalGig = gigs.find((g: any) => g.gid === gig.gid);
        return {
          ...gig,
          distance: originalGig.distance,
        };
      });

      // Return combined results
      return combinedResults;
    } catch (error) {
      console.error('Error fetching gigs:', error);
      throw new Error('Unable to fetch gigs');
    }
  }
  async findAll(): Promise<Gig[]> {
    return this.gigRepository.find({
      relations: ['services'], // Fetch all gigs with related services
    });
  }

  async findByUserId(userId: number): Promise<Gig[]> {
    try {
      return this.gigRepository.find({
        where: { user: { uid: userId } },
        relations: ['services'],
      });
    } catch (error) {
      console.log(error);
      throw new Error('Error finding gigs by user ID');
    }
  }

  async update(id: number, updateData: Partial<CreateGigDto>): Promise<Gig> {
    try {
      // await this.gigRepository.update(id, updateData);
      return this.gigRepository.findOne({
        where: { gid: id },
        relations: ['services'],
      });
    } catch (error) {
      console.log(error);
      throw new Error('Error updating gig');
    }
  }

  async getUserInfoSelectedGig(gigId: number) {
    try {
      console.log(gigId);

      const query = `SELECT 
  user.uid AS userId,  
  user.unm AS userName,
  user.fnm AS firstName,
  user.lnm AS lastName,
  user.email,
  user.tep AS telephone,
  user.imu AS userImg,
  user.str AS street,
  user.cty AS city,
  user.zcd AS zipCode,
   user.dis AS district
 FROM user LEFT JOIN gig ON gig.uid=user.uid WHERE gig.gid=?`;
      const userInfo = await this.entityManager.query(query, [gigId]);
      return userInfo;
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.gigRepository.delete(id);
    } catch (error) {
      console.log(error);
      throw new Error('Error removing gig');
    }
  }
}
