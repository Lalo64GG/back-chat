import express from "express";
import { createBoard, getBoards, getBoardById, updateBoard, deleteBoard } from "../../controllers/Board/BoardController";
import { deleteColumn } from "../../controllers/Column/ColumnController";

const router = express.Router();

router.post("/", createBoard);
router.get("/", getBoards);
router.get("/:id", getBoardById);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);
router.delete("/column/:id", deleteColumn);

export default router;
