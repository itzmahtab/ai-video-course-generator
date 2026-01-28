export type Course={
    courseId: string;
    courseName: string;
    type:string;
    createdAt: string;
    id: number;
    courselayout:courselayout;
    chapterContentSlides:chapterContentSlide[];

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
export type chapterContentSlide={
    id:number,
    courseId:string,
    chapterId:string,
    slideId:string,
    slideIndex:number,
    audioFileName:string,
    narration:{
        fullText:string,
    },
    html:string,
    revelData:any,
    createdAt:string,
}