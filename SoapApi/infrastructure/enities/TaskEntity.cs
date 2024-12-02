using System.ComponentModel.DataAnnotations.Schema;

namespace SoapApi.Infrastructure.Entities;

[Table("tasks")]
public class TaskEntity
{
    [Column("id")]
    public Guid Id { get; set; }

    [Column("title")]
    public string Title { get; set; } = null!;

    [Column("description")]
    public string Description { get; set; } = null!;

    [Column("iscompleted")]
    public bool IsCompleted { get; set; }

    [Column("duedate")]
    public DateTime DueDate { get; set; }
}
