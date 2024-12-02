using System.Runtime.Serialization;

namespace SoapApi.Dtos;

[DataContract]
public class TaskResponseDto
{
    [DataMember]
    public Guid Id { get; set; }

    [DataMember]
    public string Title { get; set; } = null!;

    [DataMember]
    public string Description { get; set; } = null!;
    
    [DataMember]
    public bool IsCompleted { get; set; }

    [DataMember]
    public DateTime DueDate { get; set; }

}