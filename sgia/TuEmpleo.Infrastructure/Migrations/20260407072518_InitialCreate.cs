using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TuEmpleo.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "categorias_empleo",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nombre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    descripcion = table.Column<string>(type: "text", nullable: true),
                    color = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "#3B82F6"),
                    icono = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "work"),
                    fecha_creacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    creado_por = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    fecha_actualizacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    actualizado_por = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    activo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_categorias_empleo", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "usuarios",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nombre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    apellido = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    email = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    telefono = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    ubicacion = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    url_curriculo = table.Column<string>(type: "text", nullable: true),
                    habilidades = table.Column<string>(type: "text", nullable: true),
                    experiencia = table.Column<string>(type: "text", nullable: true),
                    ruta_cv = table.Column<string>(type: "text", nullable: true),
                    keycloak_id = table.Column<Guid>(type: "uuid", nullable: false),
                    rol = table.Column<string>(type: "text", nullable: false),
                    fecha_creacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    creado_por = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    fecha_actualizacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    actualizado_por = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    activo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_usuarios", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "empleos",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    titulo = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    descripcion = table.Column<string>(type: "text", nullable: false),
                    requisitos = table.Column<string>(type: "text", nullable: true),
                    salario_minimo = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: true),
                    salario_maximo = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: true),
                    moneda = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true, defaultValue: "USD"),
                    modalidad = table.Column<string>(type: "text", nullable: false),
                    ubicacion = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    tipo_contrato = table.Column<string>(type: "text", nullable: false),
                    fecha_limite = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    vacantes_disponibles = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    numero_vacantes = table.Column<int>(type: "integer", nullable: false, defaultValue: 1),
                    destacado = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    empresa_id = table.Column<int>(type: "integer", nullable: false),
                    categoria_id = table.Column<int>(type: "integer", nullable: true),
                    fecha_creacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    creado_por = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    fecha_actualizacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    actualizado_por = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    activo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_empleos", x => x.id);
                    table.ForeignKey(
                        name: "FK_empleos_categorias_empleo_categoria_id",
                        column: x => x.categoria_id,
                        principalTable: "categorias_empleo",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_empleos_usuarios_empresa_id",
                        column: x => x.empresa_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "postulaciones",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    empleo_id = table.Column<int>(type: "integer", nullable: false),
                    postulante_id = table.Column<int>(type: "integer", nullable: false),
                    carta_presentacion = table.Column<string>(type: "text", nullable: true),
                    url_curriculo = table.Column<string>(type: "text", nullable: true),
                    estado = table.Column<string>(type: "text", nullable: false),
                    fecha_postulacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    fecha_revision = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    notas = table.Column<string>(type: "text", nullable: true),
                    fecha_creacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    creado_por = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    fecha_actualizacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    actualizado_por = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    activo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_postulaciones", x => x.id);
                    table.ForeignKey(
                        name: "FK_postulaciones_empleos_empleo_id",
                        column: x => x.empleo_id,
                        principalTable: "empleos",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_postulaciones_usuarios_postulante_id",
                        column: x => x.postulante_id,
                        principalTable: "usuarios",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_categorias_empleo_nombre",
                table: "categorias_empleo",
                column: "nombre",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_empleos_categoria_id",
                table: "empleos",
                column: "categoria_id");

            migrationBuilder.CreateIndex(
                name: "IX_empleos_empresa_id",
                table: "empleos",
                column: "empresa_id");

            migrationBuilder.CreateIndex(
                name: "IX_empleos_fecha_creacion",
                table: "empleos",
                column: "fecha_creacion");

            migrationBuilder.CreateIndex(
                name: "IX_empleos_titulo",
                table: "empleos",
                column: "titulo");

            migrationBuilder.CreateIndex(
                name: "IX_postulaciones_empleo_id_postulante_id",
                table: "postulaciones",
                columns: new[] { "empleo_id", "postulante_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_postulaciones_fecha_postulacion",
                table: "postulaciones",
                column: "fecha_postulacion");

            migrationBuilder.CreateIndex(
                name: "IX_postulaciones_postulante_id",
                table: "postulaciones",
                column: "postulante_id");

            migrationBuilder.CreateIndex(
                name: "IX_usuarios_email",
                table: "usuarios",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_usuarios_keycloak_id",
                table: "usuarios",
                column: "keycloak_id",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "postulaciones");

            migrationBuilder.DropTable(
                name: "empleos");

            migrationBuilder.DropTable(
                name: "categorias_empleo");

            migrationBuilder.DropTable(
                name: "usuarios");
        }
    }
}
