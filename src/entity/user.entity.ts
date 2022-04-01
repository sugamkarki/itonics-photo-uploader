import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Picture } from "./picture.entity";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id?: string;

  @Column()
  public firstName!: string;

  @Column()
  public lastName!: string;

  @Column()
  public age!: number;

  @OneToMany(() => Picture, (picture) => picture.user, {
    cascade: true,
    eager: true,
  })
  pictures: Picture[];
}
