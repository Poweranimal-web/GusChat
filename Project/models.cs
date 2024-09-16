using System;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations.Schema;
namespace models{
    public class customers{
        public int? id{get;set;}
        public string? tag{get;set;}
        public string? email{get;set;}
        public string? password{get;set;}
        public string? phone_number{get;set;}
        public string? room_number{get;set;}
        public ICollection<friends> Friends{get;set;}

    }
    public class friends{
        public int? id{get;set;}
        public string? push_room{get;set;}
        public string? private_room{get;set;}
        public int customerId{get;set;}
        public int friendsId{get;set;}
        [ForeignKey("customerId")]
        public customers Customer{get;set;}
        [ForeignKey("friendsId")]
        public customers Friend{get;set;}
    }

}