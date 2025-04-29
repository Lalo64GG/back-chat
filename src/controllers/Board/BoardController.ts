import { Request, Response } from "express";
import { Board } from "../../Models/BoardSchema";
import { Column } from "../../Models/ColumSchema"; 

export const createBoard = async (req: Request, res: Response) => {
    try {
        const { name, owner, columns } = req.body;


        const newBoard = new Board({ name, owner });
        await newBoard.save();

        const createdColumns = await Promise.all(
            columns.map(async (columnName: string) => {
                const column = new Column({
                    name: columnName,
                    board: newBoard._id  
                });
                await column.save();
                return column._id;  
            })
        );

        newBoard.columns = createdColumns;
        await newBoard.save(); 

        res.status(201).json({
            message: "Tablero creado con éxito",
            board: newBoard,
            columns: createdColumns 
        });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el tablero", error });
    }
};


export const getBoards = async (req: Request, res: Response) => {
    try {
        const boards = await Board.find().populate('columns');  
        res.json(boards);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los tableros", error });
    }
};


export const getBoardById = async (req: Request, res: Response) => {
    try {
        const board = await Board.findById(req.params.id).populate('columns');  
        if (!board) return res.status(404).json({ message: "Tablero no encontrado" });
        res.json(board);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el tablero", error });
    }
};


export const updateBoard = async (req: Request, res: Response) => {
    console.log(req.body, "updateBoard")    
    try {
        const updatedBoard = await Board.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('columns'); 
        res.json(updatedBoard);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el tablero", error });
    }
};


export const deleteBoard = async (req: Request, res: Response) => {
    try {
        await Board.findByIdAndDelete(req.params.id);
        res.json({ message: "Tablero eliminado" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el tablero", error });
    }
};

export const deletedColumn = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const column = await Column.findByIdAndDelete(id);
        if (!column) return res.status(404).json({ message: "Columna no encontrada" });
        res.json({ message: "Columna eliminada", column });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la columna", error });
    }
}
