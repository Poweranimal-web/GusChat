using Microsoft.EntityFrameworkCore;
using models;
using project;
namespace mysql{
    class DB : DbContext
    {
        DbSet<customers> customers{get;set;}
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            string connectionString = Program.builder.Configuration.GetSection("ConnectionStrings").GetValue<string>("Default");
            optionsBuilder.UseMySql(connectionString,ServerVersion.AutoDetect(connectionString));
        }

    }

}