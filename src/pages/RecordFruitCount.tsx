import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Apple, Package, Star, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const RecordFruitCount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    grade: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Fruit count recorded:', formData);
    toast.success('บันทึกจำนวนผลทุเรียนเรียบร้อยแล้ว!');
    navigate('/broker-dashboard');
  };

  const gradeInfo = {
    'A': { label: 'เกรด A', color: 'bg-green-500', description: 'คุณภาพดีเยี่ยม' },
    'B': { label: 'เกรด B', color: 'bg-blue-500', description: 'คุณภาพดี' },
    'C': { label: 'เกรด C', color: 'bg-yellow-500', description: 'คุณภาพปานกลาง' },
    'rejected': { label: 'ตกเกรด', color: 'bg-red-500', description: 'ไม่ผ่านเกณฑ์' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto animate-fade-in">
          <Card className="shadow-soft border-0 bg-card/80 backdrop-blur">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-between mb-4">
                <Link to="/broker-dashboard">
                  <Button variant="ghost" size="sm" className="p-2">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-soft">
                  <Apple className="h-8 w-8 text-white" />
                </div>
                <div className="w-8" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                บันทึกจำนวนผลทุเรียน
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                บันทึกผลทุเรียนที่เก็บเกี่ยวได้จากสวน
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-foreground font-medium flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    จำนวนที่เก็บได้ (กิโลกรัม)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className="h-12 border-border focus:ring-primary focus:border-primary transition-smooth"
                    placeholder="กรอกน้ำหนักที่เก็บได้"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade" className="text-foreground font-medium flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    เกรดคุณภาพ
                  </Label>
                  <Select value={formData.grade} onValueChange={(value) => handleInputChange('grade', value)}>
                    <SelectTrigger className="h-12 border-border focus:ring-primary">
                      <SelectValue placeholder="เลือกเกรดคุณภาพ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          เกรด A - คุณภาพดีเยี่ยม
                        </div>
                      </SelectItem>
                      <SelectItem value="B">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          เกรด B - คุณภาพดี
                        </div>
                      </SelectItem>
                      <SelectItem value="C">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          เกรด C - คุณภาพปานกลาง
                        </div>
                      </SelectItem>
                      <SelectItem value="rejected">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          ตกเกรด - ไม่ผ่านเกณฑ์
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.grade && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${gradeInfo[formData.grade as keyof typeof gradeInfo]?.color}`}></div>
                      <div>
                        <h4 className="font-medium text-foreground">
                          {gradeInfo[formData.grade as keyof typeof gradeInfo]?.label}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {gradeInfo[formData.grade as keyof typeof gradeInfo]?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 font-medium bg-gradient-to-br from-green-500 to-green-600 hover:opacity-90 text-white transition-smooth shadow-soft"
                >
                  บันทึกจำนวนผล
                </Button>
              </form>

              {/* Today's Summary */}
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="text-lg font-medium text-foreground mb-4">สรุปการเก็บเกี่ยววันนี้</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-700">85.5</div>
                      <div className="text-sm text-green-600">กิโลกรัม</div>
                      <Badge className="mt-2 bg-green-500 text-white">เกรด A</Badge>
                    </div>
                  </Card>
                  <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-700">43.2</div>
                      <div className="text-sm text-blue-600">กิโลกรัม</div>
                      <Badge className="mt-2 bg-blue-500 text-white">เกรด B</Badge>
                    </div>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecordFruitCount;