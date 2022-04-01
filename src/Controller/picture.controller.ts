import { Request, Response, Router } from "express";
import { Picture } from "../entity/picture.entity";
import { User } from "../entity/user.entity";

export class PictureController {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }
  private async getUser(req: Request) {
    const user = await User.findOne(req.params.id);
    return user;
  }
  private async getPicturesForUser(req: Request, res: Response) {
    const user = await this.getUser(req);
    if (!user) {
      return res.status(404).send("User not found!");
    }
    try {
      const pictures = await Picture.find({
        where: {
          user,
        },
      });
      res.status(200).json(pictures);
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  }

  private async addPicture(req: Request, res: Response) {
    // const userId = +req.params.id;
    // const user = await User.findOneOrFail(userId);
    const user = await this.getUser(req);
    if (!user) {
      return res.status(404).send("User not found!");
    }
    const picture: Picture = req.body;
    picture.user = user;
    try {
      const result = await Picture.save(picture);
      return res.status(200).json(result);
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  }

  private async getPictureById(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const picture = await Picture.findOneOrFail(id);
      res.status(200).json(picture);
    } catch (error) {
      res.status(404).send("Picture not found!");
    }
  }
  private async getAllPictures(req: Request, res: Response) {
    try {
      const pictures = await Picture.find({
        relations: ["user"],
      });
      res.status(200).json(pictures);
    } catch (error) {
      res.status(404).send("Picture not found!");
    }
  }

  private async updatePicture(req: Request, res: Response) {
    const id = req.params.id;

    // Check if the picture exists
    try {
      const existingPicture = await Picture.findOneOrFail(id);

      const updatedPicture: Picture = req.body;
      const picture = { ...existingPicture, ...updatedPicture };

      try {
        //   @ts-ignore
        const result = await Picture.save(picture);
        return res.status(200).json(result);
      } catch (error: any) {
        res.status(400).send(error.message);
      }
    } catch (error) {
      res.status(404).send("Picture not found!");
    }
  }

  private async removePicture(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const existingUser = await Picture.findOneOrFail(id);
      console.log(existingUser);
      try {
        await Picture.remove(existingUser);
        // return res.json("Picture Successfully Deleted").status(204);
        return res.status(204).send("Picture Successfully Deleted");
      } catch (error) {
        return res.status(400).json(error);
      }
    } catch (error) {
      res.status(404).send("Picture not found!");
    }
  }

  public getRouter(): Router {
    return this.router;
  }

  public initializeRoutes() {
    this.router.get("", (req, res) => this.getAllPictures(req, res));
    this.router.get("/user/:id", (req, res) =>
      this.getPicturesForUser(req, res)
    );
    this.router.post("/user/:id", (req, res) => this.addPicture(req, res));
    this.router.get("/:id", (req, res) => this.getPictureById(req, res));
    this.router.put("/:id", (req, res) => this.updatePicture(req, res));
    this.router.delete("/:id", (req, res) => this.removePicture(req, res));
  }
}
