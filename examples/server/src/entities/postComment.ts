import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Post} from './post';
import { User } from './user';

@Entity('post_comments')
export class PostComment {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: String,
    nullable: true
  })
  comment: string | null;

  @ManyToOne(type => User)
  user: User

  @ManyToOne(type => Post, post => post.comments)
  post: Post;
}