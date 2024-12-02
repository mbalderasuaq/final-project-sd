using Microsoft.EntityFrameworkCore;
using SoapApi.Infrastructure.Entities;

namespace SoapApi.Infrastructure;

public class RelationalDbContext : DbContext
{
    public RelationalDbContext(DbContextOptions<RelationalDbContext> options) : base(options)
    {
    }

    public DbSet<TaskEntity> Tasks{ get; set; } = null!;
}
