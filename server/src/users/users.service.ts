import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}
    
    private readonly baseXp = 20;
    private readonly growthFactor = 1.5;

    private calculateRequiredXp(level: number): number {
      if (level === 1) return this.baseXp;
      return Math.floor(this.baseXp * Math.pow(this.growthFactor, level - 1));
    }

    async checkLevelUp(user: User): Promise<User> {
      let requiredXp = this.calculateRequiredXp(user.level);
      
      while (user.xp >= requiredXp) {
        user.level++;
        user.xp -= requiredXp;
        console.log(`User ${user.email} has leveled up to level ${user.level}!`);
        requiredXp = this.calculateRequiredXp(user.level);
      }
      
      return this.usersRepository.save(user);
    }

  async create(createUserDto: any): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username }
      ]
    });

    if (existingUser) {
      if (existingUser.email === createUserDto.email) {
        throw new ConflictException('User with this email already exists');
      }
      if (existingUser.username === createUserDto.username) {
        throw new ConflictException('Username is already taken');
      }
    }

    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(createUserDto.password, salt);

    const newUser = this.usersRepository.create({
      email: createUserDto.email,
      username: createUserDto.username,
      password_hash,
    });

    return this.usersRepository.save(newUser);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }
  async findOneById(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async updateRole(id: string, role: UserRole): Promise<User> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    user.role = role;
    return this.usersRepository.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
  }
}
