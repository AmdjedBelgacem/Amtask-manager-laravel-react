import { atom } from "jotai";

interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    due_date: string;
    order: number;
}

export const tasksAtom = atom<Task[]>([]);