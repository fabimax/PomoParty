const backendUrl = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8000/' 
  : '/';

export async function rpc(method, args = {}) {
  try {
    const response = await fetch(backendUrl + 'rpc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        method,
        args,
      }),
    });

    if (!response.ok) {
      throw new Error(`Something went wrong. Error code ${response.status}`);
    }

    let result = await response.json();

    let {data, error} = result;

    if (error) {
      return {
        data: null,
        error: error || 'Unknown error'
      }
    }

    return {
      data: data,
      error: null
    }
  } catch (error) {
    console.error(error);
    return {
      data: null,
      error: 'Something went very wrong'
    }
  }
}