import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log('INSERTEDDD USER WITH ID : ', this.id);
  }
  @AfterRemove()
  logRrmove() {
    console.log('REMOVEDDDD USER WITH ID : ', this.id);
  }
  @AfterUpdate()
  logUpdate() {
    console.log('UPDATEDDD USER WITH ID : ', this.id);
  }
}
