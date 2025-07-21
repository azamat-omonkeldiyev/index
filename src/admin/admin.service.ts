import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { QueryAdminDto } from './dto/admin-query.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginAdminDto } from './dto/loginAdmin.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async findName(username:string){
    const admin = await this.prisma.aDMIN.findFirst({where:{username}})
    return admin
  }

  async create(dto: CreateAdminDto) {
    try {
      let name =await this.findName(dto.username)
      if(name){
        throw new BadRequestException({message: 'Admin username already exists!'})
      }

      let hash = bcrypt.hashSync(dto.password, 10)
      let admin= await this.prisma.aDMIN.create({
        data: {...dto, password: hash}
      })
      return admin

    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException({message: error.message})
    }
  }


  genAccToken(payload:{id:string, role:string}):string{
    return this.jwt.sign(payload,{expiresIn:'1d'})
  }

  async login(data: LoginAdminDto) {
    try {
      let user = await this.findName(data.username);
      if (!user) {
        throw new NotFoundException('Admin not found');
      }

      console.log()
      let isMatch = await bcrypt.compare(data.password, user.password);
      if (!isMatch) {
        throw new BadRequestException('Wrong credentials!!');
      }
    
      let payload = { id: user.id, role: user.role };
      let accessToken = this.genAccToken(payload);

      return { accessToken };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException({message: error.message})
    }
  }
 

  async findAll(params: QueryAdminDto) {
    const {
      page = 1,            
      limit = 10,         
      name,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    const skip = (page - 1) * limit;
  
    const where: Prisma.ADMINWhereInput = {};

    if (name) {
      where.username = { contains: name, mode: 'insensitive' };
    }

    try {
      const admin = await this.prisma.aDMIN.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder }
      })
  
      const total = await this.prisma.aDMIN.count({ where });
  
      return {
        data: admin,
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new InternalServerErrorException({message: error.message})
    }
  }

  async findOne(id: string) {
    try {
      const admin = await this.prisma.aDMIN.findFirst({where: {id}})
      if(!admin){
        throw new NotFoundException({message: "ADMIN not found!"})
      }
      return admin
    } catch (error) {
      throw new InternalServerErrorException({message: error.message})
    }
  }

  async update(id: string, dto: UpdateAdminDto) {
    try {
      await this.findOne(id)

      if(dto.password){
        let hash = bcrypt.hashSync(dto.password, 10)
        dto.password = hash
      }

      const admin = await this.prisma.aDMIN.update({where: {id},data:dto})
      return admin
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException({
            message: `The value for ${error.meta?.target} already exists.`,
          });
        }
      }
      throw new InternalServerErrorException({message: error.message})
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id)
      const admin = await this.prisma.aDMIN.delete({where: {id}})
      return admin
    } catch (error) {
      throw new InternalServerErrorException({message: error.message})
    }
  }
}
