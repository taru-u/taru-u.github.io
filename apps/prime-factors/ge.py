import sympy
import json
import os

def generate_prime_index_pairs(limit):
    """
    Generates a list of prime indices paired with their corresponding prime numbers up to a given limit.
    The result is formatted as a list of dictionaries suitable for saving into a JSON file, which can be
    easily read by a JavaScript script.
    """
    primes = list(sympy.primerange(2, limit))
    prime_pairs = [{"index": i+1, "prime": prime} for i, prime in enumerate(primes)]
    return prime_pairs

def save_prime_index_pairs(limit, filename="prime_index_pairs.json"):
    """
    Generates prime index pairs up to the given limit and saves them as a JSON file in the same folder.
    """
    prime_pairs = generate_prime_index_pairs(limit)
    
    # Save to the same folder as this script
    filepath = os.path.join(os.path.dirname(__file__), filename)
    
    with open(filepath, 'w') as f:
        json.dump(prime_pairs, f, indent=4)
    
    print(f"Prime index pairs up to {limit} saved in {filename}")

# Example usage:
n = 1000000  # You can change this limit to any value you need
save_prime_index_pairs(n)