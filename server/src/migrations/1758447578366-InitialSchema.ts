import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1758447578366 implements MigrationInterface {
    name = 'InitialSchema1758447578366'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "ownerId" uuid, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_status_enum" AS ENUM('to_do', 'in_progress', 'done')`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_difficulty_enum" AS ENUM('easy', 'medium', 'hard')`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'to_do', "difficulty" "public"."tasks_difficulty_enum" NOT NULL, "xpValue" integer NOT NULL, "userId" uuid, "projectId" uuid, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'project_manager', 'member')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "xp" integer NOT NULL DEFAULT '0', "level" integer NOT NULL DEFAULT '1', "role" "public"."user_role_enum" NOT NULL DEFAULT 'member', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "projects_members_user" ("projectsId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_15211057388e8755c88bfca9b62" PRIMARY KEY ("projectsId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e7c8cffb774447170caa8f2d43" ON "projects_members_user" ("projectsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a044e585b5ce748a525fcb498f" ON "projects_members_user" ("userId") `);
        await queryRunner.query(`CREATE TABLE "tasks_assignees_user" ("tasksId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_cdeae2f77fd4209a09f3308b71a" PRIMARY KEY ("tasksId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8b2f56214cf58675bd2fd9fd23" ON "tasks_assignees_user" ("tasksId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6e2cef93f2a903cae231e7a7d3" ON "tasks_assignees_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_a8e7e6c3f9d9528ed35fe5bae33" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_166bd96559cb38595d392f75a35" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_e08fca67ca8966e6b9914bf2956" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects_members_user" ADD CONSTRAINT "FK_e7c8cffb774447170caa8f2d43c" FOREIGN KEY ("projectsId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "projects_members_user" ADD CONSTRAINT "FK_a044e585b5ce748a525fcb498f0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks_assignees_user" ADD CONSTRAINT "FK_8b2f56214cf58675bd2fd9fd23e" FOREIGN KEY ("tasksId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tasks_assignees_user" ADD CONSTRAINT "FK_6e2cef93f2a903cae231e7a7d3d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks_assignees_user" DROP CONSTRAINT "FK_6e2cef93f2a903cae231e7a7d3d"`);
        await queryRunner.query(`ALTER TABLE "tasks_assignees_user" DROP CONSTRAINT "FK_8b2f56214cf58675bd2fd9fd23e"`);
        await queryRunner.query(`ALTER TABLE "projects_members_user" DROP CONSTRAINT "FK_a044e585b5ce748a525fcb498f0"`);
        await queryRunner.query(`ALTER TABLE "projects_members_user" DROP CONSTRAINT "FK_e7c8cffb774447170caa8f2d43c"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_e08fca67ca8966e6b9914bf2956"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_166bd96559cb38595d392f75a35"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_a8e7e6c3f9d9528ed35fe5bae33"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6e2cef93f2a903cae231e7a7d3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8b2f56214cf58675bd2fd9fd23"`);
        await queryRunner.query(`DROP TABLE "tasks_assignees_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a044e585b5ce748a525fcb498f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e7c8cffb774447170caa8f2d43"`);
        await queryRunner.query(`DROP TABLE "projects_members_user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_difficulty_enum"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
        await queryRunner.query(`DROP TABLE "projects"`);
    }

}
