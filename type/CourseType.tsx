export type Course={
    courseId: string;
    courseName: string;
    type:string;
    createdAt: string;
    id: number;
    courselayout:courselayout;

}
export type courselayout={
    courseName:string,
    courseDescription:string,
    courseId:string,
    level:string,
    totalChapters:number,
    chapters:chapter[],

}
export type chapter={
    chapterId:string,
    chapterTitle:string,
    subContent:string,

}