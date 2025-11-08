import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Like, Repository } from 'typeorm';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { Pagination } from 'src/common/interfaces/pagination.interface';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getUsers(query: GetUsersQueryDto): Promise<Pagination<User>> {
    try {
      const { search, page = 1, limit = 10 } = query;
      const skip = (page - 1) * limit;

      // Build where clause for search
      const where: Record<string, unknown> = {};
      if (search) {
        where.name = Like(`%${search}%`);
      }

      // Get total count for pagination
      const total = await this.usersRepository.count({ where });

      // Get paginated results
      const data = await this.usersRepository.find({
        where,
        order: {
          created_at: 'DESC',
        },
        skip,
        take: limit,
      });

      const totalPages = Math.ceil(total / limit);

      return {
        data,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      this.logger.error('Error fetching users', error);
      throw error;
    }
  }

  async getUser(id: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      this.logger.error('Error fetching user', error);
      throw error;
    }
  }
}
