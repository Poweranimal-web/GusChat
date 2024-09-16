namespace massage{
    class TextMessage{
        public int id{get;set;}
        public string tag{get;set;}
        public string? message{get;set;}
        public string typeMessage{get;set;}
        public DateTime time{get;set;}

    }
    class StatusOkMessage<T>{

        public string response{get;set;}
        public string? metaData{get;set;}
        public List<T>? data{get;set;} 
    }
    class DetailFriendMessage{
        public string? push_room{get;set;}
        public string? private_room{get;set;}
        public int? id{get;set;}
        public string tag{get;set;}
        public string? email{get;set;}
        public string? phone_number{get;set;}
    }
}