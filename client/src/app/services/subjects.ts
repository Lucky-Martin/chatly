import { Subject } from "rxjs";
import { IMessage } from "../models/IMessage";

export const openCreateModalSubject: Subject<void> = new Subject<void>();
export const openLogoutModalSubject: Subject<void> = new Subject<void>();
export const openMessagePreviewModal: Subject<IMessage> = new Subject<IMessage>();