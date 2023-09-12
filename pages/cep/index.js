import { Client } from "pg";

//Backend
export async function getServerSideProps({ query }) {
  console.log(query);

  const { cep } = query;
  const { rua } = query;
  let resultados = [];
  if (cep) {
    // conectar no banco e executar a consulta
    const client = new Client(
      "postgresql://aula:aula2023node@alessandroasm.com.br:45432/sistema_aula"
    );

    await client.connect();

    const result = await client.query(
      `select l.id,  l.logradouro , l.bairro , c.cidade, c.uf, l.cep
        from logradouros as l 
            inner join cidades as c
            on l."cidadeId" = c.id 
        where cep like $1 `,
      [cep]
    );
    console.log(result.rows);
    resultados = result.rows;
    await client.end();
  }

  if (rua) {
    const client = new Client(
      "postgresql://aula:aula2023node@alessandroasm.com.br:45432/sistema_aula"
    );

    await client.connect();
    const result = await client.query(
      `select l.id,  l.logradouro , l.bairro , c.cidade, c.uf, l.cep
        from logradouros as l 
            inner join cidades as c
            on l."cidadeId" = c.id 
        where logradouro like '%'||$1||'%' `,
      [rua]
    );
    console.log(result.rows);
    resultados = result.rows;
    await client.end();
  }
  return { props: { resultados } };
  // criar a conexão novamente e procurar pela rua
}

//Frontend

export default function Cep(props) {
  return (
    <div>
      <form>
        <label>
          Cep: <input type="text" name="cep" />
        </label>
        <label>
          Rua: <input type="text" name="rua" />
        </label>
        <br />

        <button type="submit">Buscar</button>
      </form>
      <h1>Resultados</h1>
      <ul>
        {props.resultados.map((r) => (
          <li key={r.id}>
            {r.logradouro}, {r.bairro}, {r.cidade}, {r.uf}, {r.cep}
          </li>
        ))}
      </ul>
    </div>
  );
}
