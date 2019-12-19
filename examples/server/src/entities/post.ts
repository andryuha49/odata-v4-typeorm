import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PostDetails} from './PostDetails';
import {PostCategory} from './PostCategory';
import {Author} from './Author';

@Entity('posts')
export class Post {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  text: string;

  // post has relation with category, however inverse relation is not set (category does not have relation with post set)
  @ManyToOne(type => PostCategory, {
    cascade: true
  })
  category: PostCategory;

  // post has relation with details. cascade inserts here means if new PostDetails instance will be set to this
  // relation it will be inserted automatically to the db when you save this Post entity
  @ManyToOne(type => PostDetails, details => details.posts, {
    cascade: ['insert']
  })
  details: PostDetails;

  // post has relation with details. not cascades here. means cannot be persisted, updated or removed
  @ManyToOne(type => Author, author => author.posts)
  author: Author;

}