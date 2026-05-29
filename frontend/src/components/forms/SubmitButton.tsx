 
export function SubmitButton({ submitting }: { submitting: boolean }) {  
  return ( 
    <button 
      id="create-pokemon" 
      type="submit" 
      disabled={submitting}
    >
      {submitting ? "Creating..." : "Create pokemon"}
    </button>
  );
}