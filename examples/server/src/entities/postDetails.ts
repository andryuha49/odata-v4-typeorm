import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Post} from './Post';

@Entity('post_details')
export class PostDetails {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: String,
    nullable: true
  })
  authorName: string | null;

  @Column({
    type: String,
    nullable: true
  })
  comment: string | null;

  @Column({
    type: String,
    nullable: true
  })
  metadata: string | null;

  @OneToMany(type => Post, post => post.details, {
    cascade: true
  })
  posts: Post[];

}