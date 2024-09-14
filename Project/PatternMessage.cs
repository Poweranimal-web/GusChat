namespace massage{
    class TextMessage{
        public int id{get;set;}
        public string tag{get;set;}
        public string? message{get;set;}
        public string typeMessage{get;set;}
        public DateTime time{get;set;}

    }
    class StatusOkMessage{
        public string response{get;set;}
        public string metaData{get;set;}
    }
}