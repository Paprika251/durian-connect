import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sprout, Users } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'owner' | 'broker'>('owner');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login:', { email, password, userType });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="shadow-soft border-0 bg-card/80 backdrop-blur">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-primary rounded-full shadow-soft">
                <Sprout className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              ระบบจัดการสวนทุเรียน
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              เข้าสู่ระบบเพื่อจัดการสวนทุเรียนของคุณ
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* User Type Selection */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={userType === 'owner' ? 'default' : 'outline'}
                className={`h-12 transition-smooth ${
                  userType === 'owner' 
                    ? 'bg-gradient-primary text-primary-foreground shadow-soft' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => setUserType('owner')}
              >
                <Sprout className="h-4 w-4 mr-2" />
                เจ้าของสวน
              </Button>
              <Button
                type="button"
                variant={userType === 'broker' ? 'default' : 'outline'}
                className={`h-12 transition-smooth ${
                  userType === 'broker' 
                    ? 'bg-gradient-secondary text-secondary-foreground shadow-soft' 
                    : 'hover:bg-muted'
                }`}
                onClick={() => setUserType('broker')}
              >
                <Users className="h-4 w-4 mr-2" />
                ผู้รับเหมา
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  อีเมล
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-border focus:ring-primary focus:border-primary transition-smooth"
                  placeholder="กรอกอีเมลของคุณ"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">
                  รหัสผ่าน
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 border-border focus:ring-primary focus:border-primary transition-smooth"
                  placeholder="กรอกรหัสผ่าน"
                  required
                />
              </div>

              <Button
                type="submit"
                className={`w-full h-12 font-medium transition-smooth shadow-soft ${
                  userType === 'owner' 
                    ? 'bg-gradient-primary hover:opacity-90 text-primary-foreground' 
                    : 'bg-gradient-secondary hover:opacity-90 text-secondary-foreground'
                }`}
              >
                เข้าสู่ระบบ
              </Button>
            </form>

            <Separator className="my-6" />

            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                ผู้รับเหมาใหม่? สามารถลงทะเบียนได้
              </p>
              <Link to="/register-broker">
                <Button 
                  variant="outline" 
                  className="w-full h-12 border-border hover:bg-accent hover:text-accent-foreground transition-smooth"
                >
                  ลงทะเบียนผู้รับเหมาใหม่
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;