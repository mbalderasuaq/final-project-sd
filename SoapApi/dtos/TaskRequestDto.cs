namespace SoapApi.Dtos;

public class TaskRequestDto
{
    public string Title { get; set; } = null!;

    public string Description { get; set; } = null!;

    public bool IsCompleted { get; set; }
}