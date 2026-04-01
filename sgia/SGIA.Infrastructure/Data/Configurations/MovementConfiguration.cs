using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SGIA.Domain.Entities;

namespace SGIA.Infrastructure.Data.Configurations
{
    public class MovementConfiguration : IEntityTypeConfiguration<Movement>
    {
        public void Configure(EntityTypeBuilder<Movement> builder)
        {
            builder.ToTable("Movements");
            builder.HasKey(m => m.Id);
            builder.Property(m => m.Quantity).IsRequired();
            builder.Property(m => m.Reason).HasMaxLength(255);
            builder.Property(m => m.MovementDate).IsRequired();
            builder.Property(m => m.Type).IsRequired();

            builder.HasOne(m => m.Product)
                .WithMany()
                .HasForeignKey(m => m.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
