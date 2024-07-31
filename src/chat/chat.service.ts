import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatDetails } from 'src/entities/chatDetails.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatDetails)
    private readonly chatRepository: Repository<ChatDetails>,
    private readonly dataSource: DataSource,
  ) {}

  async create(message: string, senderId: number, receiverId: number) {
    try {
      const chat = this.chatRepository.create({
        des: message,
        dtm: new Date(),
        uid: { uid: receiverId },
        uti: { uid: senderId },
      });

      await this.chatRepository.save(chat);
      this.findOne(senderId);
      return 'This action adds a new chat';
    } catch (error) {
      console.log(error);
    }
  }

  findAll() {
    return `This action returns all chat`;
  }

  async findOne(id: number) {
    try {
      const ChatDetailsQuery = `
     SELECT 
    chatdetail.cid AS chatID,
    sender.unm AS senderUserName,
    sender.imu AS senderImg,
    receiver.unm AS receiverUserName,
    receiver.imu AS receiverImg,
    chatdetail.des AS description,
    CASE
        WHEN chatdetail.dtm >= CURDATE() THEN 
            DATE_FORMAT(chatdetail.dtm, '%h:%i %p')
        ELSE 
 DATE_FORMAT(chatdetail.dtm, '%Y-%m-%d %l:%i %p') 
 END AS datetime,
    chatdetail.uid AS senderId,
    chatdetail.uti AS receiverId
FROM chatdetail 
LEFT JOIN user AS sender
    ON chatdetail.uid = sender.uid
LEFT JOIN user AS receiver
    ON chatdetail.uti = receiver.uid
WHERE chatdetail.uid = ? OR chatdetail.uti = ?
      `;

      const data = await this.dataSource.query(ChatDetailsQuery, [id, id]);

      const messagesByUser: {
        [key: string]: {
          id: number;
          name: string;
          imgUrl: string;
          messages: any[];
        };
      } = {};

      data.forEach((row) => {
        let relevantUserId: number;
        let relevantUserName: string;
        let relevantUserImgUrl: string;

        let messageSender: string;

        if (row.receiverId == id) {
          relevantUserId = row.senderId;
          relevantUserName = row.senderUserName;
          relevantUserImgUrl = row.senderImg;
          messageSender = 'Me';
        } else if (row.senderId == id) {
          relevantUserId = row.receiverId;
          relevantUserName = row.receiverUserName;
          messageSender = relevantUserName;
          relevantUserImgUrl = row.receiverImg;
        }

        if (relevantUserId) {
          if (!messagesByUser[relevantUserId]) {
            messagesByUser[relevantUserId] = {
              id: relevantUserId,
              name: relevantUserName,
              imgUrl: relevantUserImgUrl,
              messages: [],
            };
          }

          const message = {
            sender: messageSender,
            text: row.description,
            dateTime: row.datetime,
          };

          messagesByUser[relevantUserId].messages.push(message);
        }
      });

      // Convert the messagesByUser object into an array
      const result = Object.values(messagesByUser);

      return result;
    } catch (error) {
      console.error('Error in findOne method:', error);
      throw new Error('Error finding chat detail');
    }
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
