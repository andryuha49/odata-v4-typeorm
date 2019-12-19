import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Post} from './Post';

@Entity('authors')
export class Author {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => Post, post => post.author)
  posts: Post[];

}