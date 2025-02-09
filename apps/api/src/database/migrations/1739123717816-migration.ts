import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1739123717816 implements MigrationInterface {
    name = 'Migration1739123717816'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" RENAME COLUMN "total_price" TO "totalPrice"`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "price" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "payment_status" SET DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "totalPrice" TYPE numeric(10,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "totalPrice" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "payment_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "orders" RENAME COLUMN "totalPrice" TO "total_price"`);
    }

}
