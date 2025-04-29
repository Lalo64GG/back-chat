import { Request, Response } from "express";
import { Column } from "../../Models/ColumSchema"  


export const createColumn = async (req: Request, res: Response) => {
    try {
        const { name, board } = req.body;
        const newColumn = new Column({ name, board });
        await newColumn.save();
        res.status(201).json(newColumn);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la columna", error });
    }
};

export const getColumnsByBoard = async (req: Request, res: Response) => {
    try {
        const columns = await Column.find({ board: req.params.boardId });
        res.json(columns);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las columnas", error });
    }
};

export const  updateColumn = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const updatedColumn = await Column.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true }
        );
        if (!updatedColumn) return res.status(404).json({ message: "Columna no encontrada" });
        res.json(updatedColumn);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la columna", error });
    }
}

export const deleteColumn = async (req: Request, res: Response) => {
    try {
        await Column.findByIdAndDelete(req.params.id);
        res.json({ message: "Columna eliminada" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la columna", error });
    }
};
