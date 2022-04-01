import { Request, Response, Router } from "express";
import { User } from "../entity/user.entity";

export class UserController {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private async getAllUser(req: Request, res: Response) {
    try {
      const user = await User.find();
      res.status(200).json(user);
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  }

  private async addUser(req: Request, res: Response) {
    const user: User = req.body;
    try {
      const result = await User.save(user);
      return res.status(200).json(result);
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  }

  private async getUserById(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const user = await User.findOneOrFail(id);
      res.status(200).json(user);
    } catch (error) {
      res.status(404).send("User not found!");
    }
  }

  private async updateUser(req: Request, res: Response) {
    const id = req.params.id;

    // Check if the user exists
    try {
      const existingUser = await User.findOneOrFail(id);

      const updatedUser: User = req.body;
      const user = { ...existingUser, ...updatedUser };

      try {
        //   @ts-ignore
        const result = await User.save(user);
        return res.status(200).json(result);
      } catch (error: any) {
        res.status(400).send(error.message);
      }
    } catch (error) {
      res.status(404).send("User not found!");
    }
  }

  private async removeUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const existingUser = await User.findOneOrFail(id);
      console.log(existingUser);
      try {
        await User.remove(existingUser);
        // return res.json("User Successfully Deleted").status(204);
        return res.status(204).send("User Successfully Deleted");
      } catch (error) {
        return res.status(400).json(error);
      }
    } catch (error) {
      res.status(404).send("User not found!");
    }
  }

  public getRouter(): Router {
    return this.router;
  }

  public initializeRoutes() {
    this.router.get("", (req, res) => this.getAllUser(req, res));
    this.router.post("", (req, res) => this.addUser(req, res));
    this.router.get("/:id", (req, res) => this.getUserById(req, res));
    this.router.put("/:id", (req, res) => this.updateUser(req, res));
    this.router.delete("/:id", (req, res) => this.removeUser(req, res));
  }
}
