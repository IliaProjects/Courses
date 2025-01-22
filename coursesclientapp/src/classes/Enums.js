const SortTypeEnum = {
    Users: { Enum: 0,},
    Courses: { Enum: 1,},
}

const SortCoursesByEnum = {
    DateInc: { Enum: 0, Text: "Дата(старые)"},
    DateDec: { Enum: 1, Text: "Дата(новые)"},
    NameInc: { Enum: 2, Text: "Имя(а-я)"},
    NameDec: { Enum: 3, Text: "Имя(я-а)"},
}

const SortUsersByEnum = {
    NameInc: { Enum: 0, Text: "Имя(а-я)"},
    NameDec: { Enum: 1, Text: "Имя(я-а)"},
    RegDateInc: { Enum: 2, Text: "Регистрация(давно)"},
    RegDateDec: { Enum: 3, Text: "Регистрация(недавно)"},
    LastSeenDateInc: { Enum: 4, Text: "В сети(давно)"},
    LastSeenDateDec: { Enum: 5, Text: "В сети(недавно)"}
}

const SortCoursesCatalogByEnum = {
    DateInc: { Enum: 0, Text: "Cтарые"},
    DateDec: { Enum: 1, Text: "Новые"}
}

const ShowCoursesCatalogByEnum = {
    All: { Enum: 0, Text: "Все"},
    Accessed: { Enum: 1, Text: "Доступные"},
    Unaccessed: { Enum: 2, Text: "Недоступные"}
}

export {SortCoursesByEnum, SortUsersByEnum, SortTypeEnum, SortCoursesCatalogByEnum, ShowCoursesCatalogByEnum}