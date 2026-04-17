namespace server
{
    using Microsoft.AspNetCore.Mvc;
    using System.Threading.Tasks;
    using System.Collections.Generic;
    using System.Data;
    using Microsoft.OpenApi.Any;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.DependencyInjection;
    using Newtonsoft.Json;

    [Route("api/[controller]")]
    [ApiController]
    public class ProcedureController : ControllerBase
    {                   
        private readonly ProcedureService _procedureService;

        public ProcedureController(ProcedureService procedureService)
        {
            _procedureService = procedureService;
        }

        [HttpGet("{combinedKey}")]
        public async Task<ActionResult<string>> GetProcedureName(int combinedKey)
        {
            var procedureName = await _procedureService.GetProcedureNameByKeyAsync(combinedKey);
            if (string.IsNullOrEmpty(procedureName))
            {
                return NotFound("Procedure not found.");
            }
            return Ok(procedureName);
        }

        [HttpPost("executeProcedure/{procedureName}")]
        public async Task<IActionResult> ExecuteProcedure(string procedureName, [FromBody] AnyType[] parameters)
        {
            DataTable result = await _procedureService.ExecuteStoredProcedureAsync(procedureName, parameters);

            return Ok(JsonConvert.SerializeObject(result, Formatting.Indented));
        }

    }
}
