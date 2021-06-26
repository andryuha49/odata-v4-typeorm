import {MigrationInterface, QueryRunner} from 'typeorm';

export class DataFilling1577087002356 implements MigrationInterface {

  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`INSERT INTO "users" (id,username) 
                                  VALUES 
                                    (1,'a_manning_ursula'),
                                    (2,'a_butler_carly'),
                                    (3,'a_juarez_maggy'),
                                    (4,'a_murray_colette'),
                                    (5,'a_salinas_emmanuel'),
                                    (6,'user_1'),
                                    (7,'user_2'),
                                    (8,'user_3')`)
    await queryRunner.query(`INSERT INTO "authors" (id,name,user_id) 
                                    VALUES 
                                      (1,'Ursula Manning',1),
                                      (2,'Carly Butler',2),
                                      (3,'Maggy Juarez',3),
                                      (4,'Colette Murray',4),
                                      (5,'Emmanuel Salinas',5)`);
    await queryRunner.query(`INSERT INTO "post_category" (id,name) 
                                    VALUES 
                                      (1,'Eu Nulla Limited'),
                                      (2,'Montes Nascetur'),
                                      (3,'Sem Incorporated'),
                                      (4,'Sit Amet Consectetuer Limited'),
                                      (5,'Nisl')`);
    await queryRunner.query(`INSERT INTO "posts" (id,title,text,category_id,author_id) 
                                    VALUES 
                                      (1,'Ultricies Sem Ltd','quam. Curabitur vel lectus. Cum',1,1),
                                      (2,'Dolor Consulting','mauris ipsum porta elit, a',2,2),
                                      (3,'Feugiat Associates','tincidunt. Donec vitae erat',3,3),
                                      (4,'Ipsum Phasellus LLC','ut eros non enim commodo hendrerit. Donec porttitor',4,4),
                                      (5,'Habitant Morbi Tristique Corp.','Suspendisse',5,5),
                                      (6,'Nunc Interdum Feugiat LLC','elit, pellentesque a, facilisis non, bibendum sed, est.',1,1),
                                      (7,'Sapien Industries','dictum. Proin eget',2,2),
                                      (8,'In Hendrerit Consectetuer Foundation','vulputate, nisi sem semper erat,',3,3),
                                      (9,'Odio Aliquam Vulputate Foundation','velit eget',4,4),
                                      (10,'Cursus Ltd','ac mattis ornare, lectus ante dictum mi, ac mattis velit',5,5)`);
    await queryRunner.query(`INSERT INTO "post_comments" (id,comment,user_id,post_id) 
                                      VALUES 
                                        (1,'Nulla nec feugiat metus, ut condimentum nisi. Vestibulum ac velit.',6,1),
                                        (2,'In consequat at neque pharetra rutrum. Curabitur rutrum mi sem.',6,1),
                                        (3,'Nulla facilisi. Cras vestibulum dictum dui bibendum maximus. Nullam eu.',8,1),
                                        (4,'Pellentesque habitant morbi tristique senectus et netus et malesuada fames.',7,1),
                                        (5,'Sed rutrum pretium nunc nec condimentum. Proin non orci imperdiet.',6,1)`);                              

  }

  async down(queryRunner: QueryRunner): Promise<any> {

  }
}