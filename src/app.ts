require("dotenv").config();
import "reflect-metadata";
import express, { Express } from "express";
import { createConnection } from "typeorm";
import { UserController } from "./Controller/user.controller";
import { PictureController } from "./Controller/picture.controller";
const { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USERNAME } = process.env;

const PORT = process.env.PORT || 3003;

class Server {
  private app: Express;
  private userController!: UserController;
  private pictureController!: PictureController;

  constructor() {
    this.app = express();
    this.setupConfig();
    this.setupRoutes();
  }

  public setupConfig(): void {
    this.app.use(express.json());
  }

  public async setupRoutes(): Promise<void> {
    await createConnection({
      type: "postgres",
      host: DB_HOST,
      port: 5432,
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_DATABASE,
      synchronize: true,
      entities: ["src/entity/**/*.ts"],
      logging: false,
    });

    this.userController = new UserController();
    this.pictureController = new PictureController();

    // USERS Endpoint
    this.app.use("/users", this.userController.getRouter());
    this.app.use("/pictures", this.pictureController.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log("Listening on port:", PORT);
    });
  }
}

const server = new Server();

// Start server
server.start();
