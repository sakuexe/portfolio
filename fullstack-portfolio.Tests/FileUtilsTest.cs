using System.Text;
using fullstack_portfolio.Utils;
using Microsoft.AspNetCore.Http;
using SixLabors.ImageSharp;
using Xunit;

namespace fullstack_portfolio.Tests;

public class FileUtilsTest
{
    private readonly string basePath = Path.Combine("wwwroot", "uploads");

    [Fact]
    public async void TestSave()
    {
        // Arrange
        string filename = "test.txt";
        var file = new FormFile(new MemoryStream(Encoding.UTF8.GetBytes("test")), 0, 4, "Data", filename);
        string expectedPath = Path.Combine(basePath);

        // Act
        string result = await FileUtils.SaveFile(file) ?? "";

        // Assert
        Assert.NotNull(result);
        Assert.True(File.Exists(result));
    }

    [Fact]
    public void TestDelete()
    {
        // Arrange
        string filename = "test.txt";
        string path = Path.Combine(basePath, filename);
        File.Create(path).Close();

        // Act
        FileUtils.DeleteFile(path);

        // Assert
        Assert.False(File.Exists(path));
    }
}
