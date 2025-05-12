import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  FileText,
  CreditCard,
  User2,
  Briefcase,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { SubscriberDetail } from './types';

// Formatação de documento (CPF/CNPJ)
const formatDocument = (doc: string) => {
  if (!doc) return '';
  doc = doc.replace(/\D/g, '');
  
  if (doc.length === 11) {
    return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else if (doc.length === 14) {
    return doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  return doc;
};

// Formatação de telefone
const formatPhone = (phone: string) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
};

interface SubscriberDetailProps {
  subscriber: SubscriberDetail;
}

export default function SubscriberDetailView({ subscriber }: SubscriberDetailProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Card de informações básicas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Detalhes do Assinante</CardTitle>
              <CardDescription>Informações completas do assinante</CardDescription>
            </div>
            <Badge variant={subscriber.is_active ? "outline" : "destructive"} className={subscriber.is_active ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
              {subscriber.is_active ? "Ativo" : "Inativo"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Informações básicas */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Nome:</span>
              <span>{subscriber.name}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Email:</span>
              <span>{subscriber.email}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">CPF/CNPJ:</span>
              <span>{formatDocument(subscriber.document)}</span>
            </div>
            
            {subscriber.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Telefone:</span>
                <span>{formatPhone(subscriber.phone)}</span>
              </div>
            )}
          </div>
          
          {/* Endereço */}
          {subscriber.address && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Endereço
                </h3>
                <div className="text-sm">
                  <p>
                    {subscriber.address.street}
                    {subscriber.address.number && `, ${subscriber.address.number}`}
                    {subscriber.address.complement && ` - ${subscriber.address.complement}`}
                  </p>
                  <p>{subscriber.address.district}</p>
                  <p>
                    {subscriber.address.city} - {subscriber.address.state}, {subscriber.address.postal_code}
                  </p>
                </div>
              </div>
            </>
          )}
          
          {/* Usuário administrador */}
          {subscriber.admin_user && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <User2 className="h-4 w-4" />
                  Usuário Administrador
                </h3>
                <div className="text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Nome:</span>
                    <span>{subscriber.admin_user.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Email:</span>
                    <span>{subscriber.admin_user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Status:</span>
                    {subscriber.admin_user.is_active ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Ativo
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center gap-1">
                        <XCircle className="h-3 w-3" /> Inativo
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* Clínica (caso seja um assinante de clínica) */}
          {(subscriber as any).clinic_name && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Clínica
                </h3>
                <div className="text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Nome:</span>
                    <span>{(subscriber as any).clinic_name}</span>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* Datas */}
          <Separator />
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Datas
            </h3>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">Criado em:</span>
                <span>
                  {subscriber.created_at
                    ? format(new Date(subscriber.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card de assinatura */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Dados da Assinatura</CardTitle>
          <CardDescription>Detalhes do plano e segmento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {subscriber.subscription ? (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Plano:</span>
                  <span>{subscriber.subscription.plan_name}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Segmento:</span>
                  <span>{subscriber.subscription.segment_name}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Data de início:</span>
                  <span>
                    {subscriber.subscription.start_date
                      ? format(new Date(subscriber.subscription.start_date), "dd/MM/yyyy", { locale: ptBR })
                      : "N/A"}
                  </span>
                </div>
                
                {subscriber.subscription.end_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Data de término:</span>
                    <span>
                      {format(new Date(subscriber.subscription.end_date), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Status:</span>
                  <Badge variant="outline" className="capitalize">
                    {subscriber.subscription.status}
                  </Badge>
                </div>
              </div>
              
              {subscriber.subscription.modules && subscriber.subscription.modules.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Módulos Contratados</h3>
                    <div className="grid gap-2">
                      {subscriber.subscription.modules.map((module) => (
                        <div 
                          key={module.id} 
                          className="rounded-md border p-2 flex items-center justify-between"
                        >
                          <span>{module.name}</span>
                          {module.is_active ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              Ativo
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-100 text-gray-800">
                              Inativo
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">Nenhuma assinatura encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}