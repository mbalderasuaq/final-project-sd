using Microsoft.EntityFrameworkCore;
using SoapApi.Contracts;
using SoapApi.Infrastructure;
using SoapApi.Repositories;
using SoapApi.Services;
using SoapCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSoapCore();
builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped<ITaskContract, TaskService>();
builder.Services.AddSoapCore();

builder.Services.AddDbContext<RelationalDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

var app = builder.Build();
app.UseSoapEndpoint<ITaskContract>("/TaskService.svc", new SoapEncoderOptions());

app.UseHttpsRedirection();
app.Run();
