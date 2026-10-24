import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(email, password, fullName);
      toast({
        title: "¡Cuenta creada!",
        description: "Revisa tu email para confirmar la cuenta si tu proyecto de Supabase lo requiere.",
      });
      navigate("/", { replace: true });
    } catch (err) {
      toast({
        title: "No se pudo crear la cuenta",
        description: err?.message || "Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      icon={UserPlus}
      title="Crear cuenta"
      subtitle="Únete a Compartetupiso.es"
      footer={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Inicia sesión
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label>Nombre completo</Label>
          <Input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Tu nombre" />
        </div>
        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" />
        </div>
        <div className="space-y-1.5">
          <Label>Contraseña</Label>
          <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Creando cuenta..." : "Registrarse"}
        </Button>
      </form>
    </AuthLayout>
  );
}
