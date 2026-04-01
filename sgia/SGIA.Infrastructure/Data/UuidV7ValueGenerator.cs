
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.ValueGeneration;

namespace SGIA.Infrastructure.Data
{
    public class UuidV7ValueGenerator : ValueGenerator<Guid>
    {
        public override Guid Next(EntityEntry entry)
        {
            // Implementación simple de UUID v7 basada en timestamp.
            var timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            var guidBytes = new byte[16];
            var timestampBytes = BitConverter.GetBytes(timestamp);

            // Invertir para Big Endian si es necesario.
            if (BitConverter.IsLittleEndian) { Array.Reverse(timestampBytes); }

            timestampBytes.CopyTo(guidBytes, 0);

            // Añadir bytes aleatorios para el resto
            new Random().NextBytes(guidBytes.AsSpan(8));
            // Ajustar la versión a 7 (0111)
            guidBytes[6] = (byte)((guidBytes[6] & 0x0F) | 0x70);
            // Ajustar la variante a RFC 4122 (10xx)
            guidBytes[8] = (byte)((guidBytes[8] & 0x3F) | 0x80);

            return new Guid(guidBytes);
        }

        public override bool GeneratesTemporaryValues => false;
    }
}
