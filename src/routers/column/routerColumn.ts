import express from "express";
import { createColumn, getColumnsByBoard, deleteColumn, updateColumn } from "../../controllers/Column/ColumnController";

const router = express.Router();

router.post("/", createColumn);
router.get("/:boardId", getColumnsByBoard);
router.put("/:id", updateColumn);
router.delete("/:id", deleteColumn);

export default router;
