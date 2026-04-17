namespace server
{
    using System.Data;
    using System.Data.SqlClient;
    using System.Threading.Tasks;
    using Microsoft.Extensions.Configuration;
    using Dapper;
    using Microsoft.OpenApi.Any;
    using System.Data;
    using System.Data.SqlClient;

    public class ProcedureService
    {
        private readonly string _connectionString;

        public ProcedureService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<string?> GetProcedureNameByKeyAsync(int combinedKey) // החזרת שם הפרוצדורה
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                return await connection.QueryFirstOrDefaultAsync<string>(
                   "SELECT procedureName FROM ProceduresManagment WHERE combinedKey = @combinedKey",
                     new { combinedKey }
                );
            }

        }


        public async Task<DataTable> ExecuteStoredProcedureAsync(string procedureName,AnyType [] parameters)
        {

            using (var connection = new SqlConnection(_connectionString)) //חיבור לSQL

            using (var command = new SqlCommand(procedureName, connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                // הוספת פרמטרים דינמיים לפרוצדורה אם יש כאלה
                if (parameters != null)
                {
                    for (int i = 0; i < parameters.Length; i++)
                    {
                        command.Parameters.Add(parameters[i]);
                    }

                }

                await connection.OpenAsync();

                using (var adapter = new SqlDataAdapter(command))
                {
                    var dataTable = new DataTable();
                    adapter.Fill(dataTable); // במקום dataTable.Load(reader)
                    return dataTable;
                }
            }
        }


    }
}
