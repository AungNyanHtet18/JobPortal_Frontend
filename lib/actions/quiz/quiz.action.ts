'use server'

import { secureSearch } from "@/lib";
import { PageInfo, PageResult, PageSearch } from "@/lib/type";
import { QuizTitleListItem } from "@/lib/type/schema/quiz/quiz.schema";

export async function getQuizTitles(pageSearch: PageSearch) : Promise<PageResult<QuizTitleListItem>> {
    const response = await secureSearch('quiz/quiztitle', pageSearch)
   // return await response.json() as PageResult<QuizTitleListItem>
   return dummyQuizTitleItem as PageResult<QuizTitleListItem>
}


const dummyQuizTitles: QuizTitleListItem[] = [
    {
        quizTitle: "Java Backend Developer Technical Assessment",
        careerRoleName: "Backend Developer",
        quizQuestionCount: 15
    },
    {
        quizTitle: "React Frontend Developer Interview Quiz",
        careerRoleName: "Frontend Developer",
        quizQuestionCount: 20
    },
    {
        quizTitle: "Full Stack Developer Coding Challenge",
        careerRoleName: "Full Stack Developer",
        quizQuestionCount: 30
    },
    {
        quizTitle: "SQL Database Management Assessment",
        careerRoleName: "Database Administrator",
        quizQuestionCount: 12
    },
    {
        quizTitle: "DevOps Engineer Infrastructure Quiz",
        careerRoleName: "DevOps Engineer",
        quizQuestionCount: 25
    },
    {
        quizTitle: "Spring Boot REST API Development Test",
        careerRoleName: "Java Developer",
        quizQuestionCount: 18
    },
    {
        quizTitle: "Angular TypeScript Advanced Assessment",
        careerRoleName: "Frontend Developer",
        quizQuestionCount: 22
    },
    {
        quizTitle: "Cloud Computing Fundamentals Quiz",
        careerRoleName: "Cloud Engineer",
        quizQuestionCount: 16
    },
    {
        quizTitle: "AWS Solution Architect Practice Test",
        careerRoleName: "Cloud Architect",
        quizQuestionCount: 35
    },
    {
        quizTitle: "Microservices Architecture Interview Questions",
        careerRoleName: "Software Architect",
        quizQuestionCount: 28
    },
    {
        quizTitle: "Docker and Kubernetes Knowledge Test",
        careerRoleName: "DevOps Engineer",
        quizQuestionCount: 24
    },
    {
        quizTitle: "Python Programming Beginner Assessment",
        careerRoleName: "Python Developer",
        quizQuestionCount: 14
    },
    {
        quizTitle: "Machine Learning Engineer Technical Quiz",
        careerRoleName: "Machine Learning Engineer",
        quizQuestionCount: 40
    },
    {
        quizTitle: "Cyber Security Fundamentals Assessment",
        careerRoleName: "Security Engineer",
        quizQuestionCount: 27
    },
    {
        quizTitle: "Software Testing and QA Engineer Quiz",
        careerRoleName: "QA Engineer",
        quizQuestionCount: 19
    },
    {
        quizTitle: "Git Version Control Interview Test",
        careerRoleName: "Software Developer",
        quizQuestionCount: 10
    },
    {
        quizTitle: "System Design Interview Preparation",
        careerRoleName: "Senior Software Engineer",
        quizQuestionCount: 32
    },
    {
        quizTitle: "Data Structure and Algorithm Challenge",
        careerRoleName: "Software Engineer",
        quizQuestionCount: 50
    },
    {
        quizTitle: "C++ Programming Advanced Assessment",
        careerRoleName: "C++ Developer",
        quizQuestionCount: 26
    },
    {
        quizTitle: "Mobile Application Development Quiz",
        careerRoleName: "Mobile Developer",
        quizQuestionCount: 21
    }
];

const dummyPageInfo: PageInfo = {
    page: 0,
    size: 10,
    totalCount: 95,
    totalPage: 10,
    links: [0, 1, 2, 3, 4]
};


const dummyQuizTitleItem: PageResult<QuizTitleListItem> = {
     list: dummyQuizTitles,
     pageInfo: dummyPageInfo
}