using SoapApi.Dtos;
using SoapApi.Infrastructure.Entities;

namespace SoapApi.Mappers;

public static class TaskMapper
{
    public static TaskModel ToModel(this TaskEntity task)
    {
        return new TaskModel
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            DueDate = task.DueDate,
            IsCompleted = task.IsCompleted
        };
    }

    public static TaskModel ToModel(this TaskRequestDto task)
    {
        return new TaskModel
        {
            Title = task.Title,
            Description = task.Description,
            DueDate = DateTime.UtcNow,
            IsCompleted = task.IsCompleted
        };
    }

    public static TaskResponseDto ToDto(this TaskModel task)
    {
        return new TaskResponseDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            DueDate = task.DueDate,
            IsCompleted = task.IsCompleted
        };
    }

    public static IEnumerable<TaskResponseDto> ToDto(this IEnumerable<TaskModel> tasks)
    {
        return tasks.Select(task => task.ToDto()).ToList();
    }

    public static TaskEntity ToEntity(this TaskModel task)
    {
        return new TaskEntity
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            DueDate = task.DueDate,
            IsCompleted = task.IsCompleted
        };
    }
}