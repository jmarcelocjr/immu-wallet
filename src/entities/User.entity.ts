import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Wallet } from "./Wallet.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Wallet, (wallet) => wallet.user)
    wallets?: Wallet[];
}