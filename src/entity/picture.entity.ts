import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Picture extends BaseEntity{
  @PrimaryGeneratedColumn()
  public id?: string;

  @Column({
    nullable: false,
  })
  public url!: string;

  @ManyToOne(() => User, (user) => user.pictures, {
    onDelete: "CASCADE",
  })
  user: User;
}
