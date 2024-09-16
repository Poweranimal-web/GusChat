using Microsoft.EntityFrameworkCore;
using models;
using project;
namespace mysql{
    class DB : DbContext
    {
        public DbSet<customers> customers{get;set;}
        public DbSet<friends> friends{get;set;}
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            string connectionString = Program.builder.Configuration.GetSection("ConnectionStrings").GetValue<string>("Default");
            optionsBuilder.UseMySql(connectionString,ServerVersion.AutoDetect(connectionString));
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<customers>()
            .HasMany((db)=> db.Friends)
            .WithOne((db)=> db.Customer)
            .HasForeignKey((db)=> db.customerId);
        }

    }

}